//{{{
#include <bits/stdc++.h>
using namespace std;
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop,~))(__VA_ARGS__)
#define loop(n) rep2(_loop_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)
#define repN(a) repX a
#define repX(a0,a1,a2,x,...) x
//}}}

int R[1000];
int main(void){
	int P1, P2;
	cin >> P1 >> P2;
	int N;
	cin >> N;

	int ans = 0;
	rep(i, N){
		int r;
		cin >> r;
		if(R[r] == 0){
			R[r] = 1;
		}else{
			ans += P1 + P2;
		}
	}
	cout << ans << endl;
	return 0;
}
