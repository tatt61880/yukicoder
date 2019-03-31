#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
#define repX(a,b,c,x,...) x
#define repN(a) repX a
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop))(__VA_ARGS__)
#define rrep(...) repN((__VA_ARGS__,rrep3,rrep2))(__VA_ARGS__)
#define loop(n) rep2(i_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)

int a[10];
int b[10];
int main(){
  int n;
  cin >> n;
  vector<vector<double>> v(n);
  rep(i, n){
    double a, b;
    cin >> a >> b;
    v[i] = {-a / b, a, b};
  }
  sort(v.begin(), v.end());
  rep(i, n){
    int a, b;
    a = v[i][1];
    b = v[i][2];
    cout << a << " " << b << endl;
  }
  return 0;
}
