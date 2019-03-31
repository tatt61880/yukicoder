//{{{
#include <bits/stdc++.h>
using namespace std;
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop,~))(__VA_ARGS__)
#define loop(n) rep2(_loop_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)
#define repN(a) repX a
#define repX(a0,a1,a2,x,...) x
typedef long long ll;
const int MOD = 1e9+7;
//}}}

int main(){
	string s1, s2, s3;
	cin >> s1 >> s2 >> s3;
	if(s1 == s2 || s1 == s3){
		cout << s1 << endl;
	}else{
		cout << s2 << endl;
	}
	return 0;
}
